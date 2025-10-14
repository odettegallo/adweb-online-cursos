import {defineStore} from "pinia";
import {db} from "@/firebase/config";
import {
  collection,
  onSnapshot, // Implementar el método on Snapshot
  addDoc,     // Utilizar el método add
  updateDoc,  // Emplear el método update
  deleteDoc,  // Aplicar el método delete
  doc
} from "firebase/firestore";

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    loading: false,
    error: null
  }),
  getters: {
    // Getter para dejar la información disponible
    getCourses: (state) => state.courses
  },
  actions: {
    // Implementar mutations
    setCourses(courses) {
      this.courses = courses;
    },
    setLoading(status) {
      this.loading = status;
    },
    setError(err) {
      this.error = err;
    },

    // Acción para leer la base de datos en tiempo real (on Snapshot)
    subscribeToCourses() {
      this.setLoading(true);
      const coursesCol = collection(db, 'courses');
      // Devuelve una función para desuscribirse
      return onSnapshot(coursesCol, (snapshot) => {
        const coursesList = snapshot.docs.map(doc => ({
          id: doc.id, // El ID de Firestore es crucial para update/delete
          ...doc.data()
        }));
        this.setCourses(coursesList);
        this.setLoading(false);
      }, (error) => {
        console.error('Firestore subscription error:', error);
        this.setError(error.message);
        this.setLoading(false);
      });
    },

    // Acción para agregar curso (add)
    async addCourse(newCourseData) {
      try {
        await addDoc(collection(db, 'courses'), newCourseData);
        // onSnapshot se encargará de actualizar todas las interfaces
        return { success: true };
      } catch (error) {
        console.error('Error adding course:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    // Acción para eliminar curso (delete)
    async deleteCourse(courseId) {
      try {
        const courseRef = doc(db, 'courses', courseId);
        await deleteDoc(courseRef);
        // onSnapshot se encargará de actualizar todas las interfaces
        return { success: true };
      } catch (error) {
        console.error('Error deleting course:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    // Acción para editar curso (update)
    async updateCourse(courseId, updatedData) {
      try {
        const courseRef = doc(db, 'courses', courseId);
        await updateDoc(courseRef, updatedData); // O setDoc({ merge: true }) si fuera necesario
        // onSnapshot se encargará de actualizar todas las interfaces
        return { success: true };
      } catch (error) {
        console.error('Error updating course:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }
    }
  }
});