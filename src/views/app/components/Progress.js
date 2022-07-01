import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'react-progressbar';

const Progress = ({ percentage }) => {
  return (
        <div>
            <ProgressBar completed={percentage} />
            <h3>{percentage}% Completed.</h3>
        </div>

  );
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired
};

export default Progress;
