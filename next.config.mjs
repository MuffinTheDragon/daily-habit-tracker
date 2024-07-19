import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    fallbacks: {
        document: "/habits"
    }
});

export default withPWA({
    // Your Next.js config
});