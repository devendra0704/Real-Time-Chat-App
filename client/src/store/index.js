import { createAuthSlice } from "./slices/authSlice";
import {create} from "zustand"
import { createChatSlice } from "./slices/chatSlice";

export const useAppStore= create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}))
