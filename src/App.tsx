import { useState, useEffect } from "react";
import OpenAI from "openai";
import "./global.css";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { mirage } from "ldrs";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

mirage.register();

function App(): JSX.Element {
  const [selectedText, setSelectedText] = useState<String>("");
  useEffect(() => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes.selectedText) {
        setSelectedText(changes.selectedText.newValue);
      }
    });
    chrome.storage.local.get("selectedText", function (data) {
      const initialValue = data.selectedText;
      if (initialValue) {
        setSelectedText(initialValue);
      }
    });
    console.log(user);
    console.log("login"+login);
  }, []);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const request = async () => {
    setLoading(true);
    const request =
      "You are an expert of AI and you have to determine if the text that I will give you was written by ChatGPT or not. You will give me only percentages of probabilities that the text was written by AI and by Human following this exemple: AI: 80% Human: 20%. No other justification or information needed. This is the text that you will have to determine:" +
      selectedText;
    console.log(request);
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: request }],
      model: "gpt-3.5-turbo",
    });
    if (response.choices[0].message.content !== null) {
      console.log(response.choices[0].message.content);
      setResult(response.choices[0].message.content);
    } else {
      console.log("error");
      setSelectedText("error");
    }
    setLoading(false);
  };

  supabase.auth.onAuthStateChange(async (event) => {
    console.log(event);
    if (event !== "SIGNED_OUT") {
      setLogin(false);
      async function getUserData() {
        await supabase.auth.getUser().then((value) => {
          if (value.data?.user) {
            setUser(value.data.user);
            const id = value.data.user.id;
            console.log("id:" + id);
            addUser(id);
            getUserProfile(id);
            // createUserProfile(id);
          }
        });
      }
      getUserData();
      console.log("login"+login);
    } else {
      console.log("login"+login);
      console.log("signed out from auth");
    }
  });

  async function addUser(id: string) {
    const { data, error } = await supabase.from("credits").insert([
      {
        id: id,
      },
    ]);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  }

  async function getUserProfile(id: string) {
    const { data, error } = await supabase
      .from("credits")
      .select("*")
      .eq("id", id);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      setCredits(data[0].credit);
      console.log("credits:", data[0].credit);
    }
  }

  async function signOutUser() {
    console.log("sign out");
    await supabase.auth.signOut();
    setLogin(true);
  }
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState<any>({});
  const [credits, setCredits] = useState<number>(0);
  return (
    <main className="h-[440px] w-64 border-solid border-white border-2 flex justify-start items-center flex-col p-2">
      {login ? (
        <div className="h-[440px]">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#7f5af0",
                    brandAccent: "#7f5af0",
                  },
                },
                dark: {
                  colors: {
                    brandButtonText: "white",
                    defaultButtonBackground: "#2e2e2e",
                    defaultButtonBackgroundHover: "#3e3e3e",
                  },
                },
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>
      ) : (
        <>
          <div className="relative w-56 h-16">
            <div className="text-xl absolute inset-0 flex items-center justify-center">
              Is GPT
            </div>
            <div className="text-xs text-secondary absolute top-1/2 transform -translate-y-1/2 left-0">
              Credit: <span className="text-accent">{credits}</span>
            </div>
            <div
              className="text-xs text-secondary absolute top-1/2 transform -translate-y-1/2 right-0"
              onClick={() => signOutUser()}
            >
              sign out
            </div>
          </div>
          <div className="relative w-56 h-[275px]">
            <div className="text-sm text-secondary absolute top-8 transform -translate-y-1/2 left-0">
              Selected Text:
            </div>
            <div className="text-xs h-44 w-56 border-solid border-white border-2 overflow-hidden text-secondary absolute top-16 transform  left-0">
              <div className="overflow-auto h-full text-primary">
                {selectedText}
              </div>
            </div>
          </div>
          <div className="h-6 text-primary text-lg mb-6">
            {result}
          </div>
          <div
            className="text-lg h-12 w-40 mb-6 flex justify-center items-center bg-accent rounded font-bold"
            onClick={() => request()}
          >
            {loading ? (
              <l-mirage size="60" speed="2.5" color="white"></l-mirage>
            ) : (
              <>Check</>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default App;
