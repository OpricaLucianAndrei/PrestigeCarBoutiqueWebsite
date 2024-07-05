export interface AuthData {
    token : string,
    user: {
        id: number,
        nome: string,
        cognome: string,
        email: string,
        telefono: string,
        ruolo: string,
        pictureProfile: string | null,
        enabled: boolean,
        username: string,    
        authorities: [
            {
                authority: string
            }
        ],
        accountNonExpired: boolean,
        credentialsNonExpired: boolean,
        accountNonLocked: boolean
    }
}
