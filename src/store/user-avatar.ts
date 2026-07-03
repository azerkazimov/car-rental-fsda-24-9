// const [avatar, setAvatar] = useState<string | null>(null)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface UserAvatarState {
    avatar: string | null
    setAvatar: (avatar: string) => Promise<void>
}

export const useUserAvatar = create<UserAvatarState>((set)=> ({
    avatar: null,
    setAvatar: async (avatar: string)=> {
        set({ avatar })
        await AsyncStorage.setItem('avatar', avatar)
    }
}))