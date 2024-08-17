import mongoose from 'mongoose';

interface User {
    _id: string;
    username: string;
    password: string;
    pats?: { _id: string, token: string, desc: string }[]; // personal access tokens
    projectsMeta?: { _id: string, name: string, desc: string }[];
    // servicesMeta: { _id: string, name: string, desc: string }[];
}

const userSchema = new mongoose.Schema<User>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    pats: { type: [{ _id: String, token: String, desc: String }], required: false },
    projectsMeta: { type: [{ _id: String, name: String, desc: String }], required: false },
    // servicesMeta: { type: [{ _id: String, name: String, desc: String }], required: false },
});

const UserModel = mongoose.model<User>('User', userSchema);
export { UserModel };

// create user
export const createUser = async (username: string, password: string) => {
    const newUser = new UserModel(
        {
            username,
            password
        }
    );
    return newUser.save();
};

// login
export const login = async (username: string, password: string) => {
    return UserModel.findOne({
        username,
        password
    });
}

// create project
export const createProject = async (_id: string, project: { _id: string, name: string, desc: string }) => {
    return UserModel.findOneAndUpdate(
        { _id },
        { $push: { projectsMeta: project } },
        { new: true }
    );
}

// delete project
export const deleteProject = async (_id: string, project: { _id: string }) => {
    return UserModel.findOneAndUpdate(
        { _id },
        { $pull: { projectsMeta: project } },
        { new: true }
    );
}

// update project
export const updateProject = async (_id: string, project: { _id: string, name: string, desc: string }) => {
    return UserModel.findOneAndUpdate(
        { _id, 'projectsMeta._id': project._id },
        { $set: { 'projectsMeta.$': project } },
        { new: true }
    );
}

// add a personal access token
export const addPAT = async (_id: string, pat: { _id: string, token: string, desc: string }) => {
    return UserModel.findOneAndUpdate(
        { _id },
        { $push: { pats: pat } },
        { new: true }
    );
}

// delete a personal access token
export const deletePAT = async (_id: string, pat: { _id: string }) => {
    return UserModel.findOneAndUpdate(
        { _id },
        { $pull: { pats: pat } },
        { new: true }
    );
}