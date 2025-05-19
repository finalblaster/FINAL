import PuffLoader from 'react-spinners/PuffLoader';

const override = {
  display: 'block',
  margin: '100px auto',
};

const Spinner = ({ loading }) => {
  return (
    <PuffLoader
      color='#3B82F6'
      loading={loading}
      cssOverride={override}
      size={150}
    />
  );
};
export default Spinner;