import { withRouter, useParams } from "react-router-dom";

function Service(props) {
  const { _id } = useParams();
  let service = props.data.find((s) => s._id === _id);
  let serviceData;
  if (service) {
    serviceData = (
      <div>
        <h3> {service.name} </h3>
        <p>{service.description}</p>
        <hr />
        <h4>{service.logo}</h4>
      </div>
    );
  } else {
    serviceData = <h2> Sorry. Product doesn't exist </h2>;
  }

  return (
    <div>
      <div>{serviceData}</div>
    </div>
  );
}

export default withRouter(Service);
