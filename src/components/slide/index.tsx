import classNames from './styles.module.css';

export interface SlideProps {
  id?: string;
  children: React.ReactNode;
}

export default function Slide(props: SlideProps) {
  const { id, children } = props;
  return (
    <div id={`slide-${id}`} className={classNames.container}>
      {children}
    </div>
  );
}
