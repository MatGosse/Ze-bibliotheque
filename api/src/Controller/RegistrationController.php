<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Validator\ValidatorInterface;
final class RegistrationController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;
    public function __construct(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
    ){
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
        $this->validator = $validator;
    }

    public function __invoke(Request $request, UserPasswordHasherInterface $passwordHasher): Response
    {
        // get request body
        $data = $request->getContent();
        try {
            /** @var User $user */
            $user = $this->serializer->deserialize($data, User::class, 'json');
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }

        // check if user valid
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        // hash password
        $plaintextPassword = $user->getPassword();
        $hashedPassword = $passwordHasher->hashPassword($user, $plaintextPassword);
        $user->setPassword($hashedPassword);

        //save user in db
        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }catch (UniqueConstraintViolationException $e) {
            return new JsonResponse([
                'description' => 'Email already exists.'
            ], 409);
        }

        // return response to user
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
        ], JsonResponse::HTTP_CREATED);
    }
}
