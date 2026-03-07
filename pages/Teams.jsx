import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';

const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teams, createTeam, sendJoinRequest } = useTeam();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeView, setActiveView] = useState('all'); // 'all' or 'myteams'

  if (!user) {
    navigate('/login');
    return null;
  }

  const myTeams = teams.filter(team => team.members.some(m => m.id === user.id));
  const otherTeams = teams.filter(team => !team.members.some(m => m.id === user.id));
  const displayTeams = activeView === 'myteams' ? myTeams : otherTeams;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text mb-2">Teams</h1>
            <p className="text-gray-600">Collaborate with other vendors on projects</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
          >
            + Create Team
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveView('myteams')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeView === 'myteams'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            My Teams ({myTeams.length})
          </button>
          <button
            onClick={() => setActiveView('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeView === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Browse Teams ({otherTeams.length})
          </button>
        </div>

        {/* Teams Grid */}
        {displayTeams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-500 text-lg">
              {activeView === 'myteams' 
                ? "You haven't joined any teams yet" 
                : "No other teams available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTeams.map(team => (
              <div key={team.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-text">{team.name}</h3>
                  <span className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {team.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{team.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Skills Needed:</p>
                  <div className="flex flex-wrap gap-2">
                    {team.skillsNeeded.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Team Leader</p>
                    <p className="font-semibold">{team.leaderName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Members</p>
                    <p className="font-semibold">{team.members.length}/{team.maxMembers}</p>
                  </div>
                </div>

                {activeView === 'myteams' ? (
                  <button
                    onClick={() => navigate(`/team/${team.id}`)}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Open Workspace
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="w-full bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    View Details
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Team Modal */}
        {showCreateForm && (
          <CreateTeamModal
            onClose={() => setShowCreateForm(false)}
            onCreate={(teamData) => {
              createTeam(teamData, user.id, user.name);
              setShowCreateForm(false);
            }}
          />
        )}

        {/* Team Details Modal */}
        {selectedTeam && (
          <TeamDetailsModal
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
            onJoin={(teamId) => {
              sendJoinRequest(teamId, user.id, user.name, []);
              setSelectedTeam(null);
            }}
            currentUserId={user.id}
          />
        )}
      </div>
    </div>
  );
};

// Create Team Modal
const CreateTeamModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'crafts',
    skillsNeeded: '',
    maxMembers: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      ...formData,
      skillsNeeded: formData.skillsNeeded.split(',').map(s => s.trim())
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Create New Team</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Team Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              rows="3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
            >
              <option value="crafts">Crafts</option>
              <option value="food">Food</option>
              <option value="tailoring">Tailoring</option>
              <option value="services">Services</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Skills Needed (comma-separated)</label>
            <input
              type="text"
              value={formData.skillsNeeded}
              onChange={(e) => setFormData({...formData, skillsNeeded: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              placeholder="e.g., Sewing, Design, Packaging"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Maximum Members</label>
            <input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => setFormData({...formData, maxMembers: Number(e.target.value)})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              min="2"
              max="10"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
            >
              Create Team
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Team Details Modal
const TeamDetailsModal = ({ team, onClose, onJoin, currentUserId }) => {
  const isMember = team.members.some(m => m.id === currentUserId);
  const hasRequested = team.joinRequests.some(r => r.id === currentUserId);
  const isFull = team.members.length >= team.maxMembers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{team.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <p className="text-gray-600 mb-6">{team.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-semibold capitalize">{team.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Team Leader</p>
            <p className="font-semibold">{team.leaderName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Members</p>
            <p className="font-semibold">{team.members.length}/{team.maxMembers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-semibold">{new Date(team.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Skills Needed</h3>
          <div className="flex flex-wrap gap-2">
            {team.skillsNeeded.map((skill, index) => (
              <span key={index} className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Team Members</h3>
          <div className="space-y-2">
            {team.members.map(member => (
              <div key={member.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="font-medium">{member.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  member.role === 'leader' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {!isMember && !hasRequested && !isFull && (
          <button
            onClick={() => onJoin(team.id)}
            className="w-full bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
          >
            Request to Join
          </button>
        )}

        {hasRequested && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800 font-semibold">Join request pending approval</p>
          </div>
        )}

        {isFull && !isMember && (
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-gray-600 font-semibold">Team is full</p>
          </div>
        )}

        {isMember && (
          <button
            onClick={() => window.location.href = `/team/${team.id}`}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
          >
            Go to Team Workspace
          </button>
        )}
      </div>
    </div>
  );
};

export default Teams;
