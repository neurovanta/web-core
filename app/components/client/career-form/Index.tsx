import CareersApply from "./sections/CareersApply";
import { ApplyingForProps } from "./sections/CareerForm";

const Index = (props: ApplyingForProps) => {
  return (
    <>
      <CareersApply {...props} />
    </>
  );
};

export default Index;
