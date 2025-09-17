import React from 'react';

const profiles = [
  { id: 1, name: 'Job Description 1.pdf', size: '1.2 MB', date: '2023-10-26' },
  { id: 2, name: 'Job Description 2.pdf', size: '2.5 MB', date: '2023-10-25' },
  { id: 3, name: 'Job Description 3.pdf', size: '0.8 MB', date: '2023-10-24' },
];

const Profiles = () => {
  return (
    <main className="flex-1 p-12">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          📄 View Profiles
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">File Name</th>
                <th className="py-2 px-4 border-b">Size</th>
                <th className="py-2 px-4 border-b">Date Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="py-2 px-4 border-b">{profile.name}</td>
                  <td className="py-2 px-4 border-b">{profile.size}</td>
                  <td className="py-2 px-4 border-b">{profile.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Profiles;
