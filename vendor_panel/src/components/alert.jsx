export default function alert(props) {
  return (
    <div className={"alert alert-" + props.className} role="alert">
      <strong>{props.message}</strong>
    </div>
  );
}
