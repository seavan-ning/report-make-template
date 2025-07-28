import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(createPersistedState({
    storage: localStorage,
    key: id => `pdf-editor-${id}`,
  }))
})
