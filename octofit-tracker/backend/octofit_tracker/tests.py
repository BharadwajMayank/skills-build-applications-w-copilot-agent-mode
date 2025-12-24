from django.test import TestCase
from .models import User, Team, Activity, Workout, Leaderboard

class ModelSmokeTest(TestCase):
    def test_team_create(self):
        team = Team.objects.create(name='Test Team', description='desc')
        self.assertIsNotNone(team.pk)
    def test_user_create(self):
        team = Team.objects.create(name='T', description='d')
        user = User.objects.create(name='U', email='u@test.com', team=team)
        self.assertIsNotNone(user.pk)
    def test_activity_create(self):
        team = Team.objects.create(name='T', description='d')
        user = User.objects.create(name='U', email='u@test.com', team=team)
        activity = Activity.objects.create(user=user, type='run', duration=10, date='2025-01-01')
        self.assertIsNotNone(activity.pk)
    def test_workout_create(self):
        workout = Workout.objects.create(name='W', description='d', suggested_for='T')
        self.assertIsNotNone(workout.pk)
    def test_leaderboard_create(self):
        team = Team.objects.create(name='T', description='d')
        leaderboard = Leaderboard.objects.create(team=team, points=10)
        self.assertIsNotNone(leaderboard.pk)
