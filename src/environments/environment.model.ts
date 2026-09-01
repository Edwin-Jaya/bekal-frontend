export interface AppEnvironment {
    production: boolean;
    // baseUrl: string;
    apiUrl: string;
    
    auth0Config: {
        domain: string;
        clientId: string;
        clientSecret: string;
    };
}