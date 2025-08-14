import type { AbstractEntity } from "~/entities/AbstractEntity";

export class ApiService {
    public BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
    public token: string;
    private toast = useToast()

    public constructor(token?: string | null) {
        this.token = token? token : '';
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        console.log(response.ok)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log(errorData)
            this.toast.error({
                title: 'Erreur',
                message: errorData.description // @Todo create a service to translate errors to the user
            })
            throw new Error(errorData.description || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    public async getAll<T extends AbstractEntity>(
        entityClass: new (...args: never[]) => T,
        page: number = 1,
        extraParams?: Record<string, string | number | boolean>,
        entrypoint?: string,
    ): Promise<{
        '@context': string,
        '@id': string,
        '@type': string,
        member: T[],
        totalItems: number,
    }> {
        const domain = entrypoint ?? entityClass.name.toLowerCase();

        const params = new URLSearchParams({ page: page.toString() });
        if (extraParams) {
            for (const [key, value] of Object.entries(extraParams)) {
                params.append(key, String(value));
            }
        }
        const url = `${this.BASE_URL}/${domain}?${params.toString()}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/ld+json'
                }
            });

            return this.handleResponse(response);
        } catch (error) {
            throw new Error(`Erreur API (${domain}): ${error}`);
        }
    }

    public async get<T extends AbstractEntity>(
        entityClass: new (...args: never[]) => T,
        id: number,
        entrypoint?: string
    ): Promise<T> {
        const domain = entrypoint ?? entityClass.name.toLowerCase();
        const url = `${this.BASE_URL}/${domain}/${id}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/ld+json'
                }
            });

            return this.handleResponse(response);
        } catch (error) {
            throw new Error(`Erreur API (${domain}): ${error}`);
        }
    }

    public async post<T extends AbstractEntity>(
        entityClass: new (...args: never[]) => T,
        payload: Partial<T>,
        entrypoint?: string
    ): Promise<T> {
        const domain = entrypoint ?? entityClass.name.toLowerCase();
        const url = `${this.BASE_URL}/${domain}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/ld+json',
                }
            });

            return this.handleResponse(response);
        } catch (error) {
            throw new Error(`Erreur API (${domain}): ${error}`);
        }
    }

    public async patch<T extends AbstractEntity>(
        entityClass: new (...args: never[]) => T,
        id: number,
        payload: Partial<T>,
        entrypoint?: string
    ): Promise<T> {
        const domain = entrypoint ?? entityClass.name.toLowerCase();
        const url = `${this.BASE_URL}/${domain}/${id}`;
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                body: JSON.stringify(payload),
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/merge-patch+json',
                    'Accept': 'application/ld+json'
                }
            });

            return this.handleResponse(response);
        } catch (error) {
            throw new Error(`Erreur API (${domain}): ${error}`);
        }
    }

    public async delete<T extends AbstractEntity>(
        entityClass: new (...args: never[]) => T,
        id: number,
        entrypoint?: string
    ): Promise<void> {
        const domain = entrypoint ?? entityClass.name.toLowerCase();
        const url = `${this.BASE_URL}/${domain}/${id}`;

        try {
            await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/ld+json'
                }
            })
        } catch (error) {
            throw new Error(`Erreur API (${domain}): ${error}`);
        }
    }
}