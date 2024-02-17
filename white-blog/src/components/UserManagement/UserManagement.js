import React, { useEffect, useState } from 'react';
import { getAllUsers, setUserAsEditor, removeEditorStatus } from '../../api/api'; // Adjust the import path according to your file structure
import { Table, TableBody, TableCell, TableHead, TableRow, Switch, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers(token);
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    });

    const handleEditorChange = async (userId, isEditor) => {
        try {
            // Update editor status on the server
            if (isEditor) {
                await setUserAsEditor(userId, token);
            } else {
                await removeEditorStatus(userId, token);
            }

            // Optimistically update the UI
            const updatedUsers = users.map(user =>
                user._id === userId ? { ...user, isEditor: isEditor } : user
            );
            setUsers(updatedUsers);

            // Update local storage if the current user's editor status was changed
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser._id === userId) {
                const updatedCurrentUser = { ...currentUser, isEditor: isEditor };
                localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
            }
        } catch (error) {
            console.error(`Failed to update user ${userId} editor status:`, error);
            // Optionally, revert the UI change in case of an error
        }
    };


    return (
        <>
            <Typography variant="h3"
                component="h1"
                gutterBottom
                style={{
                    fontSize: !isMobile ? '4rem' : '2.7rem',
                    fontWeight: 700,
                    color: '#1E293B',
                    textAlign: 'left',
                    marginTop: '3rem',
                    marginLeft: '2rem'
                }}>
                Users
            </Typography>
            <Table sx={{border: '3px solid #e0e0e0',borderRadius: theme.shape.borderRadius}}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontFamily: "'Lato', sans-serif" }}>Full Name</TableCell>
                        <TableCell style={{ fontFamily: "'Lato', sans-serif" }}>Email</TableCell>
                        <TableCell style={{ fontFamily: "'Lato', sans-serif" }}>Editor</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell style={{ fontFamily: "'Lato', sans-serif" }}>{user.firstName} {user.lastName}</TableCell>
                            <TableCell style={{ fontFamily: "'Lato', sans-serif" }}>{user.email}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={user.isEditor}
                                    onChange={(event) => handleEditorChange(user._id, event.target.checked)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default UserManagement;
