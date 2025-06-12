import { create } from 'zustand'

const useStore = create((set) => ({
    User:{
        name:"",
        email:"",
        _id:"",

        profilephoto:""
    },

    isVerified: false,
    setIsVerified: (newIsVerified)=>set({isVerified: newIsVerified}),
    setUser: (newUser) =>
    set(() => ({
      User: {
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
        profilephoto: newUser.profilephoto,
      },
    })),
  


    loggedin:false,
    setLoggedIn: (newLoggedIn) => set({loggedin: newLoggedIn}),

    popadmin: false,
    setPopAdmin: (newPopAdmin) =>set({popadmin: newPopAdmin}),
    setprofilephoto: (newProfilePhoto) =>
    set((state) => ({
      User: {
        ...state.User,
        profilephoto: newProfilePhoto,
      },
    })),
}))

export default useStore