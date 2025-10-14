import {defineStore} from "pinia";
import { auth } from "@/firebase/config";
import {createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged } from "firebase/auth";
  import router from "../router/index";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Almacena la información del usuario
    isAuthenticated: false,
    authModalMessage: ''
  }),
  getters: {
    // Getter para dejar la información disponible
    currentUserEmail: (state) => state.user ? state.user.email : null,
    isLoggedIn: (state) => state.isAuthenticated
  },
  actions: {
    // Implementar mutations
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    setAuthModalMessage(message) {
      this.authModalMessage = message;
    },

    // Crear nuevos usuarios (create User With Email And Password)
    async registerUser(email, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // La mutación (setUser) se ejecutará a través de onAuthStateChanged
        return userCredential;
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error;
      }
    },

    // Ingresar usuarios existentes (sign In With Email And Password)
    async loginUser(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // La mutación (setUser) se ejecutará a través de onAuthStateChanged
        return userCredential;
      } catch (error) {
        console.error('Login error:', error.message);
        throw error;
      }
    },

    // Cerrar sesión (sign Out)
    async logoutUser() {
      try {
        await signOut(auth);
        // La mutación (setUser) se ejecutará a través de onAuthStateChanged
        router.push({ name: 'Login' }); // Redirigir inmediatamente a Login
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    },

    // Aplicar el método on Auth State Changed
    // Se llama al inicializar la app (e.g., en App.vue o main.js)
    subscribeToAuthState() {
      onAuthStateChanged(auth, (user) => {
        this.setUser(user);
        if (user) {
          // Si el usuario ingresó correctamente (incluyendo registro y login)
          this.setAuthModalMessage(`¡Bienvenido! Has ingresado como: ${user.email}`);
          // Mostrar modal/alert y redirigir
          if (router.currentRoute.value.name === 'Login' || router.currentRoute.value.name === 'Register') {
            router.push({ name: 'Home' });
          }
        } else {
          // Usuario salió
          this.setAuthModalMessage('');
        }
      });
    }
  }
});