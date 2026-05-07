import { useState, useEffect, useCallback } from "react";
import ChatInterface from "./chatinterface";
import AuthForm from "./authform";
import Toast from "./toast";
import useToast from "./toaskhook";
import Icons from "./icons";
import { api } from "./../lib/basepath";

export default function Root() {
  const [auth, setAuth] = useState(null);
  const [checking, setChecking] = useState(true);
  const { toasts, add: toast, remove } = useToast();
  const [sidemenu, setsidemenuRaw] = useState(false);
  const setsidemenu = useCallback((val) => setsidemenuRaw(val), []);

  useEffect(() => {
    function avoidwarn() {
      const token = localStorage.getItem("med_token");
      if (!token) {
        setChecking(false);
        return;
      }

      api
        .get("/gettokenpayload", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async ({ data }) => {
          const userId = data.payload.id;
          const { data: accData } = await api.get(`/getmyaccinfo/${userId}`);
          const username = accData.getmydoc.username;
          setAuth({ token, username, userId });
        })
        .catch(() => localStorage.removeItem("med_token"))
        .finally(() => setChecking(false));
    }
    avoidwarn();
  }, []);

  const handleAuth = async (token, username) => {
    const { data } = await api.get("/gettokenpayload", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAuth({ token, username, userId: data.payload.id });
  };

  const handleLogout = () => {
    localStorage.removeItem("med_token");
    setAuth(null);
    toast("Signed out", "info");
  };

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <span className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin inline-block mb-3" />
          <p className="text-slate-500 text-sm">Restoring session…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast toasts={toasts} remove={remove} Icons={Icons} />
      {auth ? (
        <ChatInterface
          username={auth.username}
          userId={auth.userId}
          token={auth.token}
          toast={toast}
          onLogout={handleLogout}
          setsidemenu={setsidemenu}
          sidemenu={sidemenu}
        />
      ) : (
        <AuthForm onAuth={handleAuth} toast={toast} />
      )}
    </>
  );
}
