import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient.js';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/dashboard/reports');
        setReports(response.data.reports || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Technician Reports
        </Typography>

        {loading && <Typography>Loading reports…</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !reports.length && <Typography>No reports available.</Typography>}

        <Stack spacing={2} sx={{ mt: 2 }}>
          {reports.map((report) => (
            <Card key={report._id}>
              <CardContent>
                <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mb: 1 }}>
                  <Chip label={`Ticket: ${report.ticket?.title || 'Unknown'}`} color="primary" />
                  <Chip label={`Tech: ${report.technician?.username || 'Unknown'}`} color="secondary" />
                  <Chip label={`Reported by: ${report.reportedBy?.username || 'Unknown'}`} />
                  <Chip label={`Status: ${report.status}`} variant="outlined" />
                </Stack>

                <Typography variant="body1" sx={{ mb: 1 }}>
                  {report.comment}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Ticket lab: {report.ticket?.Lab || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(report.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default Reports;
