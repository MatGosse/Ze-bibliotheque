import {ApiService} from "~/services/api.service";
import {User} from "~/entities/User";
import {useAuthStore} from "~/stores/auth";

export class LoginService {
    private apiService= new ApiService()
    private toast = useToast()

    public async login(user:User): Promise<void> {
        const authStore = useAuthStore()

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
        authStore.setToken(data.value.token);

        await navigateTo('/');
        this.toast.success({ title: 'Connection réussis', message: 'Vous pouvez maintenant publier ou modifier les ressources.' })
    }

    public async register(user: Partial<User>): Promise<void>{
        this.apiService.post(User, user,'registration').then(()=>{
            this.toast.success({ title: 'Compte crée', message: 'Vous devez vous connecter pour publier ou modifier les ressources.' })
        });
    }
}
