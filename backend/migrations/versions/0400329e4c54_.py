"""empty message

Revision ID: 0400329e4c54
Revises: 
Create Date: 2021-06-01 14:10:15.956810

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0400329e4c54'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=True),
    sa.Column('email', sa.String(length=50), nullable=True),
    sa.Column('password', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('columns',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=250), nullable=True),
    sa.Column('color', sa.String(length=7), nullable=True),
    sa.Column('order', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('cards',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(length=500), nullable=True),
    sa.Column('order', sa.Integer(), nullable=True),
    sa.Column('column_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['column_id'], ['columns.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('cards')
    op.drop_table('columns')
    op.drop_table('users')
    # ### end Alembic commands ###
