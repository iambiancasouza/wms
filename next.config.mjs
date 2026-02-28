/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uxhmovsdbzxwjalmrieb.supabase.co', // O link exato que deu erro no seu terminal
        port: '',
        pathname: '/storage/v1/object/public/**', // Permite ler a pasta de fotos do banco
      },
    ],
  },
};

export default nextConfig;