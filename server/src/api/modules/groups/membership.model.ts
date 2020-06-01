import ROLES from '../../constants/roles';

export default (sequelize, DataTypes) => {
  // Define the membership schema
  const membershipSchema = {
    playerId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM(ROLES),
      allowNull: false,
      defaultValue: ROLES[0],
      validate: {
        isIn: {
          args: [ROLES],
          msg: 'Invalid role'
        }
      }
    }
  };

  // Define other table options
  const options = {
    indexes: [
      {
        unique: true,
        fields: ['playerId', 'groupId']
      }
    ]
  };

  // Create the model
  const Membership = sequelize.define('memberships', membershipSchema, options);

  Membership.associate = models => {
    Membership.belongsTo(models.Player, {
      foreignKey: 'playerId',
      onDelete: 'CASCADE'
    });
    Membership.belongsTo(models.Group, {
      foreignKey: 'groupId',
      onDelete: 'CASCADE'
    });
  };

  return Membership;
};
