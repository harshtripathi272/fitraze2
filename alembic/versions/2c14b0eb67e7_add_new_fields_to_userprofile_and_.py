"""Add new fields to UserProfile, FitnessGoal, and SleepLogs, remove unused tables

Revision ID: 2c14b0eb67e7
Revises: <PUT_PREVIOUS_REVISION_ID_HERE>
Create Date: 2025-08-12 00:02:04.288538
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# Revision identifiers
revision: str = '2c14b0eb67e7'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # --- Drop unused tables ---
    op.drop_table('meal_logs')
    op.drop_table('foods')
    op.drop_table('water_logs')

    # --- Update fitness_goals ---
    op.add_column('fitness_goals', sa.Column('target_weight_value', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('fitness_goals', sa.Column('current_weight_value', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('fitness_goals', sa.Column('target_protien_value', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('fitness_goals', sa.Column('target_carbs_value', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('fitness_goals', sa.Column('target_fat_value', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('fitness_goals', sa.Column('target_calorie_value', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.drop_column('fitness_goals', 'target_value')
    op.drop_column('fitness_goals', 'current_value')

    # --- Update food_entries ---
    op.add_column('food_entries', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_unique_constraint(None, 'food_entries', ['user_id'])
    op.create_foreign_key(None, 'food_entries', 'users', ['user_id'], ['user_id'])

    # --- Update sleep_logs ---
    # Drop existing primary key constraint
    op.drop_constraint('sleep_logs_pkey', 'sleep_logs', type_='primary')

    # Add new 'id' column
    op.add_column('sleep_logs', sa.Column('id', sa.Integer(), autoincrement=True, nullable=True))

    # Populate 'id' for existing rows
    op.execute("""
        UPDATE sleep_logs
        SET id = sub.row_num
        FROM (
            SELECT row_number() OVER (ORDER BY user_id) AS row_num, ctid
            FROM sleep_logs
        ) AS sub
        WHERE sleep_logs.ctid = sub.ctid
    """)

    # Alter id to be NOT NULL and primary key
    op.alter_column('sleep_logs', 'id', nullable=False)
    op.create_primary_key('pk_sleep_logs', 'sleep_logs', ['id'])

    # Now add the rest of your new columns
    op.add_column('sleep_logs', sa.Column('date', sa.Date(), nullable=False))
    op.add_column('sleep_logs', sa.Column('duration_label', sa.String(length=50), nullable=True))
    op.add_column('sleep_logs', sa.Column('wake_up', sa.Time(), nullable=False))
    op.add_column('sleep_logs', sa.Column('sleep_quality_score', sa.Integer(), nullable=True))
    op.add_column('sleep_logs', sa.Column('sleep_quality_label', sa.String(length=50), nullable=True))
    op.add_column('sleep_logs', sa.Column('streak_count', sa.Integer(), nullable=True))
    op.add_column('sleep_logs', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('sleep_logs', sa.Column('updated_at', sa.DateTime(), nullable=True))

    op.alter_column('sleep_logs', 'user_id', existing_type=sa.INTEGER(), nullable=False)
    op.alter_column('sleep_logs', 'sleep_duration_hours',
        existing_type=sa.NUMERIC(precision=4, scale=2),
        type_=sa.Float(),
        existing_nullable=False
    )
    op.alter_column('sleep_logs', 'bedtime',
        existing_type=postgresql.TIMESTAMP(),
        type_=sa.Time(),
        existing_nullable=False
    )
    op.drop_column('sleep_logs', 'logged_at')
    op.drop_column('sleep_logs', 'sleep_log_id')
    op.drop_column('sleep_logs', 'quality_rating')
    op.drop_column('sleep_logs', 'wake_up_time')

    # --- Update user_profiles ---
    op.add_column('user_profiles', sa.Column('age', sa.Integer(), nullable=False))
    op.add_column('user_profiles', sa.Column('health_condition', sa.String(length=255), nullable=True))
    op.add_column('user_profiles', sa.Column('equipment_access', sa.String(length=255), nullable=True))
    op.add_column('user_profiles', sa.Column('motivation', sa.String(length=255), nullable=True))
    op.add_column('user_profiles', sa.Column('habits', sa.JSON(), nullable=True))
    op.add_column('user_profiles', sa.Column('challenges', sa.JSON(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # --- Revert user_profiles changes ---
    op.drop_column('user_profiles', 'challenges')
    op.drop_column('user_profiles', 'habits')
    op.drop_column('user_profiles', 'motivation')
    op.drop_column('user_profiles', 'equipment_access')
    op.drop_column('user_profiles', 'health_condition')
    op.drop_column('user_profiles', 'age')

    # --- Revert sleep_logs changes ---
    op.add_column('sleep_logs', sa.Column('wake_up_time', postgresql.TIMESTAMP(), nullable=False))
    op.add_column('sleep_logs', sa.Column('quality_rating', sa.INTEGER(), nullable=True))
    op.add_column('sleep_logs', sa.Column('sleep_log_id', sa.INTEGER(), autoincrement=True, nullable=False))
    op.add_column('sleep_logs', sa.Column('logged_at', postgresql.TIMESTAMP(), nullable=True))
    op.alter_column('sleep_logs', 'bedtime', type_=postgresql.TIMESTAMP(), existing_type=sa.Time(), existing_nullable=False)
    op.alter_column('sleep_logs', 'sleep_duration_hours', type_=sa.NUMERIC(precision=4, scale=2), existing_type=sa.Float(), existing_nullable=False)
    op.alter_column('sleep_logs', 'user_id', existing_type=sa.INTEGER(), nullable=True)
    op.drop_column('sleep_logs', 'updated_at')
    op.drop_column('sleep_logs', 'created_at')
    op.drop_column('sleep_logs', 'streak_count')
    op.drop_column('sleep_logs', 'sleep_quality_label')
    op.drop_column('sleep_logs', 'sleep_quality_score')
    op.drop_column('sleep_logs', 'wake_up')
    op.drop_column('sleep_logs', 'duration_label')
    op.drop_column('sleep_logs', 'date')
    op.drop_column('sleep_logs', 'id')

    # --- Revert food_entries changes ---
    op.drop_constraint(None, 'food_entries', type_='foreignkey')
    op.drop_constraint(None, 'food_entries', type_='unique')
    op.drop_column('food_entries', 'user_id')

    # --- Revert fitness_goals changes ---
    op.add_column('fitness_goals', sa.Column('current_value', sa.NUMERIC(precision=10, scale=2), nullable=True))
    op.add_column('fitness_goals', sa.Column('target_value', sa.NUMERIC(precision=10, scale=2), nullable=True))
    op.drop_column('fitness_goals', 'target_calorie_value')
    op.drop_column('fitness_goals', 'target_fat_value')
    op.drop_column('fitness_goals', 'target_carbs_value')
    op.drop_column('fitness_goals', 'target_protien_value')
    op.drop_column('fitness_goals', 'current_weight_value')
    op.drop_column('fitness_goals', 'target_weight_value')

    # Note: We do not recreate foods, meal_logs, or water_logs because they are obsolete
