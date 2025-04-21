import { Leaf } from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
// import LanguageSwitcher from "./LanguageSwitcher";
import LanguageSwitcher from "./LangSwitcher";

function Navbar() {
  const { loginWithRedirect, user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const { t, i18n } = useTranslation();
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      setRenderKey((prev) => prev + 1); // Force re-render when language changes
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const handleGoogleLogin = async () => {
    await loginWithRedirect();
    const token = await getAccessTokenSilently();
    try {
      localStorage.setItem("Token", token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div key={renderKey} className="w-full bg-white shadow-md py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-2">
            <Leaf color="#0b9a32" size={36} />
            <h1 className="text-2xl font-bold text-[#0b9a32]">AgriAuthentic</h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <NavLink to="/"  className="text-gray-700 hover:text-[#0b9a32] transition-all duration-300">{t("dashboard")}</NavLink>
            <NavLink to="/products" className="text-gray-700 hover:text-[#0b9a32] transition-all duration-300">{t("Products")}</NavLink>
            <NavLink to="/marketplace" className="text-gray-700 hover:text-[#0b9a32] transition-all duration-300">{t("marketplace")}</NavLink>
            <NavLink to="/analytics" className="text-gray-700 hover:text-[#0b9a32] transition-all duration-300">{t("analytics")}</NavLink>
            <NavLink to="/profile" className="text-gray-700 hover:text-[#0b9a32] transition-all duration-300">{t("profile")}</NavLink>

            <span className="text-gray-700 hover:text-[#0b9a32] transition-all duration-300">
              {!isAuthenticated ? (
                <button onClick={handleGoogleLogin}>{t("login")}</button>
              ) : (
                <>
                  <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                    {t("logout")}
                  </button>
                  <div>
                    <h1>{user.name}</h1>
                    <h1>{user.email}</h1>
                    <img src={user.picture} alt="" />
                  </div>
                </>
              )}
            </span>
          </nav>
            <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
