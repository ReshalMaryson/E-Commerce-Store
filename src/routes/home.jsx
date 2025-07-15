import "../css/home.css";
import Banner from "../components/home/banner";
import Category from "../components/home/category";
export default function Home() {
  return (
    <>
      <div className="container" style={{ padding: "0.3rem" }}>
        <div className="banner">
          <Banner />
        </div>
        <div className="category_box">
          <Category />
        </div>
      </div>
    </>
  );
}
