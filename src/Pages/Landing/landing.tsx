import { Grid, Stack } from "@mantine/core";
import "./Landing.css"
import { signupReq } from "../../api/auth";
import { auth } from "../../utils/firebase";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Layout() {

  const router = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user)
        router("/mapContainer")
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAccessToken = async () => {
    let token = await auth.currentUser?.getIdToken();
    await signupReq(token as string)
    // router.push("/companylist")

    router("/mapContainer")
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleAccessToken()
      // router.push("/dashboard")
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Grid h="100vh" gutter={0}>
      <Grid.Col span={{ xs: 12, md: 6 }} className="layout-container">
        <div className="container">
          <div className="img_container">
            <h2 className="title">Mapify</h2>
          </div>
          <div className="txtBox">
            <div className="txtBox-title">
              Check out the locations on map in a 3d view
            </div>
            <div className="txtBox-para">
              Introducing the application which displays the map in 3d cuboid and displays the latest viewings.
            </div>
            <button type="button" onClick={handleGoogleSignIn} className="mobbtn">
              <img src="/google.svg" alt="google" />
              Sign In With Google
            </button>
          </div>

        </div>
      </Grid.Col>

      <Grid.Col span={6} className="signin-container">
        <Stack align="center" style={{ margin: "auto" }}>
          <button type="button" onClick={handleGoogleSignIn} className="createbtn">
            <img src="/google.svg" alt="google" />
            Sign In With Google
          </button>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}