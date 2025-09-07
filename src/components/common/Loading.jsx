import React from 'react';

const Loading = () => {
    return (
       <div className="min-h-screen flex items-center justify-center  dashboard-main">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
        </div>
      </div>
    );
};

export default Loading;