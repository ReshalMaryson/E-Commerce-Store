import "../../css/category.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Category() {
  const navigate = useNavigate();

  function showShirts() {
    navigate("/collection/shirts", { state: { category: "shirt" } });
  }
  function showPants() {
    navigate("/collection/pants", { state: { category: "pants" } });
  }
  function showJackets() {
    navigate("/collection/jackets", { state: { category: "jacket" } });
  }
  function showWatches() {
    navigate("/collection/watches", { state: { category: "watch" } });
  }

  return (
    <>
      <div className="category">
        <h1>-CATEGORIES-</h1>

        <div className="category_items">
          <div className="category_shirts category_item" onClick={showShirts}>
            <p> Shirts.</p>
          </div>
          <div className="category_pants category_item" onClick={showPants}>
            <p> Pants.</p>
          </div>
          <div className="category_jackets category_item" onClick={showJackets}>
            <p> Jackets.</p>
          </div>
          <div className="category_watches category_item" onClick={showWatches}>
            <p> Watches.</p>
          </div>
        </div>
        <div className="Link">
          <Link to="/collection" className="Link-View-all">
            VIEW ALL
          </Link>
        </div>
      </div>
    </>
  );
}
