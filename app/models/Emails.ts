import mongoose from "mongoose";

const emailsSchema = new mongoose.Schema({
    toEmailContact: String,
    toEmailCareer: String,
    toEmailHome: String,
})

const Email = mongoose.models.Email || mongoose.model("Email", emailsSchema);

export default Email;