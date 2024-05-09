import classNames from './styles.module.css';

export interface YearProps {
  children: React.ReactNode;
  color?: 'black' | 'white' | 'blue' | 'purple' | undefined;
}

export default function Year(props: YearProps) {
  const { children, color } = props;
  let css = `${classNames.date} `;
  switch (color) {
    case 'black':
      css += `${classNames.black}`;
      break;
    case 'blue':
      css += `${classNames.blue}`;
      break;
    case 'purple':
      css += `${classNames.purple}`;
      break;
    case 'white':
      css += `${classNames.white}`;
      break;
    default:
      css += `${classNames.black}`;
  }

  return <h1 className={css}>{children}</h1>;
}
