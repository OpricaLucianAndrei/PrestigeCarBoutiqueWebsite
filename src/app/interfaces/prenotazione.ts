export interface Prenotazione {
    id: number;
    user: {
        id: number;
        nome: string;
        cognome: string;
        email: string;
        telefono: string | null;
        enabled: boolean;
        username: string;
        authorities: {
            authority: string;
        }[];
        accountNonLocked: boolean;
        accountNonExpired: boolean;
        credentialsNonExpired: boolean;
    };
    auto: {
        id: number;
        marca: string;
        modello: string;
        anno: number;
    };
    dataPrenotazione: string;
    oraPrenotazione: string;
}
