import * as Yup from 'yup'

export const changePasswordSchema = Yup.object().shape({
     oldPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
          'Must contain one uppercase, one lowercase, one number and one special case character',
        )
        .required('old Password is required'),
     newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
         .max(14, 'Password must be at most 14 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
          'Must contain one uppercase, one lowercase, one number and one special case character',
        )
        .required('new Password is required')
        .test(  'passwords-do-not-match','The new password cannot be the same as the old password.', 
            function (value){
                return value !== this.parent.oldPassword
            }
        )
})