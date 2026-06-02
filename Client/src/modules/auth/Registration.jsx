// import { Link } from "react-router-dom";
// import "./register.css";
// import { useState } from "react";

// export const RegistrationFormReact = () => {
//   const [user, setUser] = useState({
//     firstName:"",
//     lastName:"",
//     email:"",
//     password:"",
//     confirmPassword:"",
//     phoneNumber:"",
//     role:"user",
//     companyName:"",
// });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUser((prev)=>({...prev,[name]:value}))
//   };

//   const handleFormSubmit = async (event) => {
//   event.preventDefault();

//   try {
//     const res = await fetch("http://localhost:5000/api/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(user)
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Registration successful ✅");
//       console.log(data);
//     } else {
//       alert(data.message);
//     }

//   } catch (error) {
//     console.log(error);
//     alert("Something went wrong");
//   }
// };

//   return (
//     <>
//     <div className="page">
//       <form onSubmit={handleFormSubmit}>
//         <div className="container">
//             <section
//         className="summary"
//         style={{ textAlign: "center", marginTop: "30px" }}>
//         <p>
//           Hello, my name is
//           <span>
//             {user.firstName} {user.lastName}
//           </span>
//           . My email address is <span>{user.email}</span> and my phone number is
//           <span>{user.phoneNumber}</span>.
//         </p>
//       </section>
//           <h1>Sign Up</h1>
//           <p>Please fill in this form to create an account.</p>

//           <label htmlFor="firstName">
//             <b>First Name</b>
//           </label>
//           <input
//             type="text"
//             name="firstName"
//             placeholder="Enter firstName"
//             required
//             value={user.firstName}
//             onChange={handleInputChange}
//           />

//           <label htmlFor="lastName">
//             <b>Last Name</b>
//           </label>
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Enter lastName"
//             required
//             value={user.lastName}
//             onChange={handleInputChange}
//           />

//           <label htmlFor="email">
//             <b>Email</b>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter Email"
//             name="email"
//             required
//             value={user.email}
//             onChange={handleInputChange}
//           />

//           <label htmlFor="password">
//             <b>Password</b>
//           </label>
//           <input
//             type="password"
//             placeholder="Enter Password"
//             name="password"
//             required
//             value={user.password}
//             onChange={handleInputChange}
//           />

//           <label htmlFor="confirmPassword">
//             <b>Confirm Password</b>
//             </label>
//             <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             required
//             value={user.confirmPassword}
//             onChange={handleInputChange}
//             />
            
//             {user.confirmPassword && user.password !== user.confirmPassword && (
//             <p style={{ color: "red", fontSize: "1.2rem" }}>
//                 Passwords do not match
//             </p>
//             )}

//             <label htmlFor="companyName">
//             <b>Company Name</b>
//             </label>

//             <input
//             type="text"
//             name="companyName"
//             placeholder="Enter Company Name"
//             value={user.companyName}
//             onChange={handleInputChange}
//             />
//             <label htmlFor="role">
//             <b>Select Role</b>
//             </label>
//             <select
//             name="role"
//             value={user.role}
//             onChange={handleInputChange}
//             style={{
//                 width: "100%",
//                 padding: "12px",
//                 borderRadius: "8px",
//                 margin: "8px 0 18px 0",
//             }}
//             >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//             </select>

//           <label htmlFor="phone">
//             <b>Phone Number</b>
//           </label>
//           <input
//             type="tel"
//             name="phoneNumber"
//             placeholder="9876543211"
//             required
//             value={user.phoneNumber}
//             onChange={handleInputChange}
//           />

//           <p>
//             By creating an account you agree to our
//             <a href="#" style={{ color: "dodgerblue" }}>
//               Terms & Privacy
//             </a>
//           </p>

//           <div className="clearfix">
//             <button type="submit" className="btn">
//               Sign Up
//             </button>
//             <span>Already have an account ?
//                 <Link to="/">Login</Link>
//             </span>
//           </div>
//         </div>
//       </form>
//     </div>
//     </>
//   );
// };






import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { useState } from "react";

export const RegistrationFormReact = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "employee",
    companyName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Password validation
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful ✅");

        console.log(data);

        // Optional auto login
        if (data.token) {
          localStorage.setItem("token", data.token);

          localStorage.setItem(
            "role",
            data.user?.role || user.role
          );

          localStorage.setItem(
            "user",
            JSON.stringify(data.user || user)
          );
        }

        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page">
        <form onSubmit={handleFormSubmit}>
          <div className="container">
            {/* Live Summary */}
            <section
              className="summary"
              style={{
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              <p>
                Hello, my name is
                <span>
                  {" "}
                  {user.firstName} {user.lastName}
                </span>
                . My email address is
                <span> {user.email}</span> and my
                phone number is
                <span> {user.phoneNumber}</span>.
              </p>
            </section>

            {/* Heading */}
            <h1>Sign Up</h1>

            <p>
              Please fill in this form to create an
              account.
            </p>

            {/* First Name */}
            <label htmlFor="firstName">
              <b>First Name</b>
            </label>

            <input
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              required
              value={user.firstName}
              onChange={handleInputChange}
            />

            {/* Last Name */}
            <label htmlFor="lastName">
              <b>Last Name</b>
            </label>

            <input
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              required
              value={user.lastName}
              onChange={handleInputChange}
            />

            {/* Email */}
            <label htmlFor="email">
              <b>Email</b>
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              value={user.email}
              onChange={handleInputChange}
            />

            {/* Password */}
            <label htmlFor="password">
              <b>Password</b>
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              required
              value={user.password}
              onChange={handleInputChange}
            />

            {/* Confirm Password */}
            <label htmlFor="confirmPassword">
              <b>Confirm Password</b>
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={user.confirmPassword}
              onChange={handleInputChange}
            />

            {/* Password Match Error */}
            {user.confirmPassword &&
              user.password !==
                user.confirmPassword && (
                <p
                  style={{
                    color: "red",
                    fontSize: "1rem",
                    marginBottom: "15px",
                  }}
                >
                  Passwords do not match
                </p>
              )}

            {/* Company Name */}
            <label htmlFor="companyName">
              <b>Company Name</b>
            </label>

            <input
              type="text"
              name="companyName"
              placeholder="Enter Company Name"
              value={user.companyName}
              onChange={handleInputChange}
            />

            {/* Role Selection */}
            <label htmlFor="role">
              <b>Select Role</b>
            </label>

            <select
              name="role"
              value={user.role}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                margin: "8px 0 18px 0",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                background: "#fff",
              }}
            >
              <option value="employee">
                Employee
              </option>

              <option value="hr">
                HR Manager
              </option>

              <option value="finance">
                Finance
              </option>

              <option value="inventory">
                Inventory Manager
              </option>

              <option value="sales">
                Sales
              </option>

              <option value="purchase">
                Purchase Manager
              </option>

              <option value="crm">
                CRM Manager
              </option>

              <option value="project">
                Project Manager
              </option>

              <option value="helpdesk">
                Help Desk
              </option>

              <option value="asset">
                Asset Manager
              </option>

              <option value="admin">
                Administrator
              </option>
            </select>

            {/* Phone Number */}
            <label htmlFor="phoneNumber">
              <b>Phone Number</b>
            </label>

            <input
              type="tel"
              name="phoneNumber"
              placeholder="9876543210"
              required
              value={user.phoneNumber}
              onChange={handleInputChange}
            />

            {/* Terms */}
            <p>
              By creating an account you agree to our{" "}
              <a
                href="#"
                style={{ color: "dodgerblue" }}
              >
                Terms & Privacy
              </a>
            </p>

            {/* Buttons */}
            <div className="clearfix">
              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Sign Up"}
              </button>

              <span
                style={{
                  display: "block",
                  marginTop: "15px",
                }}
              >
                Already have an account?{" "}
                <Link to="/">Login</Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};