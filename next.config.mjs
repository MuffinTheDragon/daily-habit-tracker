import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === 'development',
    customWorkerSrc: "./src/service-worker",
    register: true,
    reloadOnOnline: true
});

export default withPWA({
    // Your Next.js config
    reactStrictMode: false
});