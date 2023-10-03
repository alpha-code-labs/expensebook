import React from 'react';
import { Link } from 'react-router-dom';

const Home1 = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <ul>
              Configure Company General Info
              <li>
                <Link to="/companyinfo">Company Info</Link>
              </li>
              <li>
                <Link to="/cash-advance-expense_settlement">CashAdvance Settlement</Link>
              </li>
              <li>
                <Link to="/multicurrency">Multi-Currency</Link>
              </li>
              <li><Link to="/configure-company-structure">Configure Company Structure</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home1;


