import express from "express";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/ContactsController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const app=express();
const contactsRoutes=express.Router();

contactsRoutes.post("/search",verifyToken,searchContacts);
contactsRoutes.get("/get-contact-for-dm",verifyToken,getContactsForDMList)
contactsRoutes.get("/get-all-contacts",verifyToken,getAllContacts);

export default contactsRoutes;