import {ApiService} from "~/services/api.service";
import {User} from "~/entities/User";

export class LoginService {
    private apiService= new ApiService()
    private toast = useToast()

    public async login(user:User): Promise<void> {

        // send request
        const { data, error } = await useFetch<{ token: string }>(`${this.apiService.BASE_URL}/login_check`, {
            method: "POST",
            body: JSON.stringify(user),
        });

        // check body
        if (error.value) {
            this.toast.error({ title: 'Identifiants incorrect', message: 'Il semblerais que votre mot de passe ou votre email est incorect' })
        }
        if (!data.value) {
            throw new Error(`Aucune donnée retournée par l'API ()`);
        }
        // store token
        useCookie('auth_token').value = data.value.token;

        await navigateTo('/');
        this.toast.success({ title: 'Connection Réussis', message: 'Vous pouvez maintenant publier ou modifier les ressources.' })
    }

    public async register(user: Partial<User>): Promise<void>{
        await this.apiService.post(User, user,'registration');
    }
}
