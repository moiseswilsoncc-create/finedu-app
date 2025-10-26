function App() {
  console.log("🧪 App.tsx está montando...");

  try {
    const location = useLocation();
    const navigate = useNavigate();

    console.log("📍 location:", location);
    console.log("📍 navigate:", navigate);

    // ... resto del código
