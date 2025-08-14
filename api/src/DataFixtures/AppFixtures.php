<?php

namespace App\DataFixtures;

use App\Entity\Authors;
use App\Entity\Books;
use App\Entity\Categories;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $passwordHasher;
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        $authors = [];
        $categories = [];

        for ($i = 0; $i < 10; $i++) {
            $author = new Authors();
            $author->setName($faker->unique()->name);
            $manager->persist($author);

            $authors[] = $author;
        }

        $manager->flush();

        for ($i = 0; $i < 10; $i++) {
            $category = new Categories();
            $category->setName($faker->unique()->name);
            $manager->persist($category);

            $categories[] = $category;
        }

        $manager->flush();

        for ($i = 0; $i < 83; $i++) {
            $book = new Books();
            $book->setName($faker->unique()->sentence(3));

            $randomAuthor = $authors[array_rand($authors)];
            $book->setAuthor($randomAuthor);

            $randomCategoryCount = rand(1, 3);
            $randomCategoryKeys = array_rand($categories, $randomCategoryCount);

            if (!is_array($randomCategoryKeys)) {
                $randomCategoryKeys = [$randomCategoryKeys];
            }
            foreach ($randomCategoryKeys as $key) {
                $book->addCategory($categories[$key]);
            }

            $manager->persist($book);
        }

        $manager->flush();


        $user = new User();
        $user->setEmail('admin@test.fr');
        $plaintextPassword = 'password';
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $plaintextPassword
        );
        $user->setPassword($hashedPassword);
        $manager->persist($user);
        $manager->flush();

    }
}
