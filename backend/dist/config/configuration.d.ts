declare const _default: () => {
    port: number;
    corsOrigin: string[];
    jwt: {
        accessSecret: string | undefined;
        refreshSecret: string | undefined;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
};
export default _default;
