import { create } from 'zustand'

const useStore = create((set) => ({
    User:{
        name:"",
        email:"",
        _id:"",

        profilephoto:""
    },
    setUser: (newUser) =>
    set(() => ({
      User: {
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
        profilephoto: newUser.profilephoto,
      },
    })),
  
}))

export default useStore