
interface ImovelPageProps {
  params: {
    id: string
  }
}

const ImovelPage = ({ params }: ImovelPageProps) => {
  const { id } = params;


  return (
    <div>
      <p>{id}</p>
    </div>
  );
}

export default ImovelPage;