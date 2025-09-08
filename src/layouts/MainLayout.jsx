import { Outlet } from 'react-router';
import Footer from '../components/common/Footer';
import LandingPageNavbar from '../components/common/LandingNavbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import LogoLoading from '../components/common/LogoLoading';

const MainLayout = () => {
    const [authChecking, setAuthChecking] = useState(true);
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            setAuthChecking(false);
        });
        return unsubscribe;
    }, []);
    if (authChecking || navigation.state === "loading") {
        return <LogoLoading />;
    }
    return (
        <div>
            <LandingPageNavbar></LandingPageNavbar>
            <div>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;