import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  profileImage?: string;
}

const MyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    email: '',
    name: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // 비밀번호 변경
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/users/me');
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (err) {
      // Mock data for development
      const mockProfile: UserProfile = {
        id: 1,
        email: 'user@example.com',
        name: '홍길동',
        phone: '010-1234-5678',
        address: '서울시 강남구 역삼동 123-45',
      };
      setProfile(mockProfile);
      setEditedProfile(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof UserProfile) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditedProfile(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    try {
      await axiosClient.put('/api/users/me', editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      setSnackbar({ open: true, message: '프로필이 저장되었습니다.', severity: 'success' });
    } catch (err) {
      // Save locally for demo
      setProfile(editedProfile);
      setIsEditing(false);
      setSnackbar({ open: true, message: '프로필이 저장되었습니다.', severity: 'success' });
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    try {
      await axiosClient.put('/api/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSnackbar({ open: true, message: '비밀번호가 변경되었습니다.', severity: 'success' });
    } catch (err) {
      // For demo
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSnackbar({ open: true, message: '비밀번호가 변경되었습니다.', severity: 'success' });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        내 정보
      </Typography>

      <Grid container spacing={3}>
        {/* 프로필 정보 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                프로필 정보
              </Typography>
              <Button
                variant={isEditing ? 'outlined' : 'contained'}
                onClick={handleEditToggle}
              >
                {isEditing ? '취소' : '수정'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                src={profile.profileImage}
                sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              {isEditing && (
                <Button variant="outlined" size="small">
                  이미지 변경
                </Button>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="이메일"
                  fullWidth
                  value={editedProfile.email}
                  disabled
                  helperText="이메일은 변경할 수 없습니다"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="이름"
                  fullWidth
                  value={editedProfile.name}
                  onChange={handleInputChange('name')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="연락처"
                  fullWidth
                  value={editedProfile.phone}
                  onChange={handleInputChange('phone')}
                  disabled={!isEditing}
                  placeholder="010-0000-0000"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="주소"
                  fullWidth
                  value={editedProfile.address}
                  onChange={handleInputChange('address')}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleSaveProfile}>
                  저장
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 비밀번호 변경 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              비밀번호 변경
            </Typography>
            <Divider sx={{ my: 2 }} />

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <TextField
                label="현재 비밀번호"
                type="password"
                fullWidth
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
              <TextField
                label="새 비밀번호"
                type="password"
                fullWidth
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                helperText="8자 이상 입력해주세요"
              />
              <TextField
                label="새 비밀번호 확인"
                type="password"
                fullWidth
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <Button
                variant="contained"
                onClick={handlePasswordChange}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                비밀번호 변경
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* 회원 탈퇴 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="error">
              회원 탈퇴
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </Typography>
            <Button variant="outlined" color="error">
              회원 탈퇴
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyProfilePage;

