import { NavLink, useNavigate, useRouteError } from "react-router-dom";
import "../styles/dashboard.css"
export const ErrorPage = () => {
  const error = useRouteError();
  const navigate =useNavigate()

  const handleGoBack = () =>{
    navigate(-1);
  }
  if (error.status === 404)
    return (
      <section className="error-section">
        <div id="error-text">
          <figure className="error-figure">
            <img
              src="https://cdn.dribbble.com/users/722246/screenshots/3066818/404-page.gif"
              alt="Animated 404 error page"
            />
          </figure>
        
        </div>
        {/* <NavLink to="/" className="btn">
          Go back To Home Page
        </NavLink>
         */}

         <button className="button-error" onClick={handleGoBack}>
            Go Back 
         </button>
      </section>
    );

  return <h1>The page you are looking do not exist </h1>;
};
