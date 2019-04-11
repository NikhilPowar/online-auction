export const UserType = {
    User : 'User',
    Admin : 'Admin'
};

const tmpArr = [];
for (const key of Object.keys(UserType)) {
    tmpArr.push(UserType[key]);
}
export const UserTypeArr = tmpArr;

interface UserModel {
    uid: String;
    FirstName: String;
    LastName: String;
    Email: String;
    Location: String;
    AccountType: String;
}
export default UserModel;
