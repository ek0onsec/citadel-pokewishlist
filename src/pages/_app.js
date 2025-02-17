import Navbar from '../components/Navbar';
import '@/app/globals.css';
export default function App({ Component, pageProps }) {
    return (
        <>
            <Navbar />
            <Component {...pageProps} />
        </>
    );
}