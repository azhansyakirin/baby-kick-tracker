import { useLocation, Link } from 'react-router-dom';
import { LucideChevronRight } from 'lucide-react';

const Breadcrumbs = () => {

  const path = useLocation().pathname;
  const crumbs = path.split('/').filter(crumb => crumb !== '');

  return (
    <nav className="text-sm" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex space-x-1">
        <li>
          <Link to="/home" className="hover:underline">Home</Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const crumbPath = `/${crumbs.slice(0, index + 1).join('/')}`;
          const formattedCrumb = crumb.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

          return (
            <li key={crumbPath} className="inline-flex items-center">
              <LucideChevronRight className="size-5 mx-1" />
              {isLast ? (
                <span className="">{formattedCrumb}</span>
              ) : (
                <Link to={crumbPath} className="hover:underline">{formattedCrumb}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs;